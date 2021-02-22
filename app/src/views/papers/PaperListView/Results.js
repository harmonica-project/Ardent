import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import parseUserKey from '../../../utils/parseUserKey';
import parsePaperType from '../../../utils/parsePaperType';
import reduceLongText from '../../../utils/reduceLongText';
import SubToolbar from './SubToolbar';
import DisplayStatus from '../../../components/DisplayStatus';
import TableActionCell from '../../../components/TableActionCell';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    count, page, rowsPerPage, onChangePage
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    }
  },
});

function Row({ row, actionHandler }) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const displayArchitecturesTable = () => {
    return (
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.architectures.map((architectureRow) => (
            <TableRow key={architectureRow.id}>
              <TableCell align="center">{architectureRow.name}</TableCell>
              <TableCell>{reduceLongText(architectureRow.description, 100)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const displayNoArchitecture = () => {
    return (
      <Typography variant="h6" color="textSecondary" gutterBottom component="div">
        No architecture yet.
      </Typography>
    );
  };

  return (
    <>
      <TableRow className={classes.root} key={row.id}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.doi}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{reduceLongText(row.abstract, 100)}</TableCell>
        <TableCell align="center">{row.authors}</TableCell>
        <TableCell>{row.journal}</TableCell>
        <TableCell align="center">{parsePaperType(row.paper_type)}</TableCell>
        <TableCell align="center">{parseUserKey(row.added_by)}</TableCell>
        <TableCell align="center">{parseUserKey(row.updated_by)}</TableCell>
        <TableCell align="center"><DisplayStatus status={row.status} /></TableCell>
        <TableCell align="center"><TableActionCell id={row.id} actionHandler={actionHandler} /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box style={{ padding: 20 }}>
              <Paper style={{ padding: 20 }}>
                <SubToolbar />
                { row.architectures.length ? displayArchitecturesTable() : displayNoArchitecture() }
              </Paper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    doi: PropTypes.string,
    name: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    abstract: PropTypes.string,
    journal: PropTypes.string,
    paper_type: PropTypes.string,
    added_by: PropTypes.string.isRequired,
    updated_by: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    architectures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired
  }).isRequired,
  actionHandler: PropTypes.func.isRequired
};

export default function Results({ papers, actionHandler }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">DOI</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Abstract</TableCell>
            <TableCell align="center">Authors</TableCell>
            <TableCell>Journal</TableCell>
            <TableCell align="center">Paper type</TableCell>
            <TableCell align="center">Added by</TableCell>
            <TableCell align="center">Updated by</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? papers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : papers
          ).map((row) => (
            <Row key={row.id} row={row} actionHandler={actionHandler} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={papers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

Results.propTypes = {
  papers: PropTypes.array.isRequired,
  actionHandler: PropTypes.func.isRequired
};
