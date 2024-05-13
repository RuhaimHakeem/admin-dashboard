/* eslint-disable react/prop-types */
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

export default function ReviewsTable({ orderReviews }) {
  const emojis = ['😠', '😑', '🙂', '😃', '😍'];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Customer Number</TableCell>
            <TableCell>Sentiment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderReviews?.map((review) => (
            <TableRow>
              <TableCell>{review.product}</TableCell>
              <TableCell>{review.customerName || 'No Name'}</TableCell>
              <TableCell>{review.mobile}</TableCell>
              <TableCell sx={{ position: 'relative' }}>
                <div
                  style={{
                    fontSize: '2em',
                    textAlign: 'center',
                    position: 'absolute',
                    width: 'min-content',
                    right: 0,
                    left: 0,
                    top: 8,
                    bottom: 0,
                    zIndex: 1,
                  }}
                >
                  {emojis[review.sentiment - 1]}
                </div>
                <Slider
                  defaultValue={5}
                  value={review.sentiment}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  max={5}
                  disabledSwap
                  min={1}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
