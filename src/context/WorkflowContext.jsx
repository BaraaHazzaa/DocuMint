import { useState, createContext, useContext } from 'react';
import { notificationService } from '../services/notificationService';
import { useNotifications } from './NotificationContext';

const WorkflowContext = createContext();

export const WORKFLOW_STEPS = {
  INITIATED: 'initiated',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
};

export const WORKFLOW_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  ESCALATE: 'escalate',
  COMMENT: 'comment',
};

export const IMPORTANCE_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const REMINDER_INTERVALS = {
  FIRST_REMINDER: 24, // hours
  SECOND_REMINDER: 48,
  ESCALATION: 72,
};

export const NOTIFICATION_TYPES = {
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  REMINDER: 'reminder',
  COMMENT: 'comment',
};

const workflowRules = {
  [IMPORTANCE_LEVELS.LOW]: {
    route: ['MANAGER_REVIEW', 'COMPLETED'],
    escalationTime: 48, // hours
  },
  [IMPORTANCE_LEVELS.MEDIUM]: {
    route: ['MANAGER_REVIEW', 'VICE_MANAGER_REVIEW', 'COMPLETED'],
    escalationTime: 24,
  },
  [IMPORTANCE_LEVELS.HIGH]: {
    route: ['MANAGER_REVIEW', 'VICE_MANAGER_REVIEW', 'DIRECTOR_REVIEW', 'COMPLETED'],
    escalationTime: 12,
  },
  [IMPORTANCE_LEVELS.URGENT]: {
    route: ['MANAGER_REVIEW', 'DIRECTOR_REVIEW', 'COMPLETED'],
    escalationTime: 4,
  },
};

export function WorkflowProvider({ children }) {
  const [workflows, setWorkflows] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useNotifications();

  const initializeWorkflow = async (transaction) => {
    const { id, importance, approvalChain } = transaction;
    
    const workflow = {
      transactionId: id,
      currentStep: WORKFLOW_STEPS.INITIATED,
      importance,
      approvalChain: approvalChain.map((approver, index) => ({
        ...approver,
        status: 'pending',
        order: index,
        deadline: calculateDeadline(importance, index)
      })),
      currentApproverIndex: 0,
      history: [],
      status: WORKFLOW_STEPS.INITIATED,
      lastUpdated: new Date(),
      reminders: []
    };

    setWorkflows(prev => ({ ...prev, [id]: workflow }));
    await scheduleReminders(workflow);
    return workflow;
  };

  const calculateDeadline = (importance, approverIndex) => {
    const baseHours = {
      [IMPORTANCE_LEVELS.LOW]: 72,
      [IMPORTANCE_LEVELS.MEDIUM]: 48,
      [IMPORTANCE_LEVELS.HIGH]: 24,
      [IMPORTANCE_LEVELS.URGENT]: 12
    };

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + baseHours[importance]);
    return deadline;
  };

  const scheduleReminders = async (workflow) => {
    const { transactionId, approvalChain, currentApproverIndex } = workflow;
    const currentApprover = approvalChain[currentApproverIndex];

    if (!currentApprover) return;

    const now = new Date();
    const deadline = currentApprover.deadline;
    const timeUntilDeadline = deadline.getTime() - now.getTime();

    // Schedule first reminder at 24 hours
    if (timeUntilDeadline > REMINDER_INTERVALS.FIRST_REMINDER * 3600000) {
      await notificationService.scheduleReminder(
        transactionId,
        currentApprover.approverId,
        REMINDER_INTERVALS.FIRST_REMINDER
      );
    }

    // Schedule escalation
    if (timeUntilDeadline > REMINDER_INTERVALS.ESCALATION * 3600000) {
      const nextApprover = approvalChain[currentApproverIndex + 1];
      if (nextApprover) {
        await notificationService.scheduleEscalation(
          transactionId,
          currentApprover.approverId,
          nextApprover.approverId,
          REMINDER_INTERVALS.ESCALATION
        );
      }
    }
  };

  const processAction = async ({
    transactionId,
    action,
    userId,
    comment,
    signature
  }) => {
  try {
    const workflow = workflows[transactionId];
    if (!workflow) throw new Error('لم يتم العثور على سير العمل');
    
    // Validate inputs
    if (!transactionId) throw new Error('معرف المعاملة مطلوب');
    if (!action) throw new Error('الإجراء مطلوب');
    if (!userId) throw new Error('معرف المستخدم مطلوب');

    const { approvalChain, currentApproverIndex } = workflow;
    const currentApprover = approvalChain[currentApproverIndex];

    if (currentApprover.approverId !== userId) {
      throw new Error('Unauthorized action');
    }

    setLoading(true);
    setError(null);
      let nextStatus;
      let nextApproverIndex = currentApproverIndex;

      switch (action) {
        case WORKFLOW_ACTIONS.APPROVE:
          if (!signature) throw new Error('Signature required for approval');
          
          approvalChain[currentApproverIndex] = {
            ...currentApprover,
            status: 'approved',
            signature,
            actionDate: new Date(),
            comment
          };

          // Move to next approver or complete
          if (currentApproverIndex < approvalChain.length - 1) {
            nextApproverIndex++;
            nextStatus = WORKFLOW_STEPS.IN_PROGRESS;
          } else {
            nextStatus = WORKFLOW_STEPS.COMPLETED;
          }
          break;

        case WORKFLOW_ACTIONS.REJECT:
          approvalChain[currentApproverIndex] = {
            ...currentApprover,
            status: 'rejected',
            actionDate: new Date(),
            comment
          };
          nextStatus = WORKFLOW_STEPS.REJECTED;
          break;

        case WORKFLOW_ACTIONS.ESCALATE:
          // Find next available higher-level approver
          const nextHigherApprover = approvalChain.findIndex((approver, index) => 
            index > currentApproverIndex && 
            ['director', 'vice_manager'].includes(approver.role)
          );

          if (nextHigherApprover === -1) {
            throw new Error('No higher level approver available');
          }

          nextApproverIndex = nextHigherApprover;
          nextStatus = WORKFLOW_STEPS.ESCALATED;
          break;

        default:
          throw new Error('Invalid action');
      }

      // Update workflow state
      const updatedWorkflow = {
        ...workflow,
        currentApproverIndex: nextApproverIndex,
        status: nextStatus,
        approvalChain,
        history: [
          ...workflow.history,
          {
            action,
            userId,
            comment,
            timestamp: new Date(),
            step: currentApproverIndex
          }
        ],
        lastUpdated: new Date()
      };

      setWorkflows(prev => ({
        ...prev,
        [transactionId]: updatedWorkflow
      }));

      // Send notifications
      await sendNotifications(updatedWorkflow, action);

      // Schedule reminders for next approver
      if (nextStatus === WORKFLOW_STEPS.IN_PROGRESS) {
        await scheduleReminders(updatedWorkflow);
      }

      return { success: true, workflow: updatedWorkflow };
    } catch (error) {
      console.error('Error processing workflow action:', error);
      setError(error);
      showAlert(error.message || 'Error processing workflow action', 'error');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const sendNotifications = async (workflow, action) => {
    const { transactionId, approvalChain, currentApproverIndex } = workflow;
    const currentApprover = approvalChain[currentApproverIndex];
    const nextApprover = approvalChain[currentApproverIndex + 1];

    switch (action) {
      case WORKFLOW_ACTIONS.APPROVE:
        if (nextApprover) {
          await notificationService.sendEmailNotification(
            nextApprover.approverId,
            'New Transaction for Review',
            `You have a new transaction (${transactionId}) waiting for your review.`
          );
        }
        break;

      case WORKFLOW_ACTIONS.REJECT:
        // Notify transaction creator
        await notificationService.sendEmailNotification(
          workflow.createdBy,
          'Transaction Rejected',
          `Your transaction (${transactionId}) has been rejected. Reason: ${currentApprover.comment}`
        );
        break;

      case WORKFLOW_ACTIONS.ESCALATE:
        if (nextApprover) {
          await notificationService.sendEmailNotification(
            nextApprover.approverId,
            'Escalated Transaction',
            `An escalated transaction (${transactionId}) requires your immediate attention.`
          );
        }
        break;
    }
  };

  const getWorkflowStatus = (transactionId) => {
    return workflows[transactionId] || null;
  };

  const canTakeAction = (userId, transactionId) => {
    const workflow = workflows[transactionId];
    if (!workflow) return false;

    const { approvalChain, currentApproverIndex, status } = workflow;
    if (status === WORKFLOW_STEPS.COMPLETED || status === WORKFLOW_STEPS.REJECTED) {
      return false;
    }

    return approvalChain[currentApproverIndex]?.approverId === userId;
  };

  const value = {
    initializeWorkflow,
    processAction,
    getWorkflowStatus,
    canTakeAction,
    workflows,
    loading,
    error
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};