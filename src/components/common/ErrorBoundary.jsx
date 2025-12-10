import { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            عذراً، حدث خطأ غير متوقع
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRetry}
          >
            إعادة المحاولة
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}