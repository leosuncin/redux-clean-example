import { Link, Typography } from '@mui/material';

function Copyright(props: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/leosuncin">
        Jaime Suncin
      </Link>
      &nbsp;
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default Copyright;
