import { Grid, Paper } from '@mui/material';

function DashboardContent() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          Chart
        </Paper>
      </Grid>

      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          Recent
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          Table
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardContent;
