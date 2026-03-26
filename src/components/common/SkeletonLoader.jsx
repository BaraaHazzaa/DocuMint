import { Skeleton, Box } from '@mui/material';

/**
 * A reusable skeleton loader for content.
 *
 * @param {object} props
 * @param {number} [props.lines=3] - The number of text lines to display.
 * @param {string|number} [props.height=40] - The height of the skeleton lines.
 */
const SkeletonLoader = ({ lines = 3, height = 40 }) => {
  return (
    <Box>
      {Array.from(new Array(lines)).map((_, index) => (
        <Skeleton key={index} variant="text" height={height} />
      ))}
    </Box>
  );
};

export default SkeletonLoader;
