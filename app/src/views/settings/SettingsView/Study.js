import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button
} from '@material-ui/core';
import TableActionCell from 'src/components/TableActionCell';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const Study = ({
  categories, actionHandler, className, ...rest
}) => {
  const classes = useStyles();
  const [categoryValue, setCategoryValue] = useState('');

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Update study settings"
          title="Study"
        />
        <Divider />
        <CardContent>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="label"
                    align="center"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    key="actions"
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`row-category-${row.id}`}>
                      <TableCell key={`cell-category-${row.id}`} align="center">
                        {row.label}
                      </TableCell>
                      <TableCell align="center">
                        <TableActionCell
                          actionHandler={actionHandler}
                          item={row}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow hover role="checkbox" tabIndex={-1} key="row-category-new">
                  <TableCell key="cell-category-new" align="center">
                    <TextField
                      id="new-category-input"
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      placeholder="Add new category"
                      value={categoryValue}
                      onChange={(e) => setCategoryValue(e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        actionHandler('new', { label: categoryValue });
                        setCategoryValue('');
                      }}
                      variant="contained"
                    >
                      Add new category
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </form>
  );
};

Study.propTypes = {
  className: PropTypes.string,
  categories: PropTypes.array,
  actionHandler: PropTypes.func
};

export default Study;
