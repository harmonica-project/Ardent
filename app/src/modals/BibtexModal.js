import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import * as yup from 'yup';
import {
  Box,
  Typography,
  Modal,
  Button,
  Input,
  InputAdornment,
  FormControl,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core/';
import {
  Add as AddIcon,
  PriorityHigh as ErrorIcon,
  ClearAll as DuplicateIcon
} from '@material-ui/icons';
import { BibLatexParser } from 'biblatex-csl-converter';
import { doesPaperExists } from 'src/requests/papers';
import PropTypes from 'prop-types';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  body: {
    position: 'absolute',
    width: '60%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  input: {
    display: 'none',
  },
  saveButton: {
    marginTop: theme.spacing(2)
  }
}));

export default function BibtexModal({
  open, setOpen, saveHandler
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [filename, setFilename] = useState('No file provided.');
  const [papers, setPapers] = useState([]);
  const [progress, setProgress] = useState({
    counter: 0,
    max: 0,
    open: false
  });

  const handleClose = () => {
    setOpen(false);
    setFilename('No file provided.');
    setPapers([]);
    setProgress({ ...progress, open: false });
  };

  const getModalHeader = () => {
    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2">
            Import BibTeX file
          </Typography>
          <Typography variant="body2" gutterBottom>
            Experimental feature: parsing can fail.
          </Typography>
        </Box>
      </Box>
    );
  };

  const parseAuthorsNames = (authorObject) => {
    let authorField = '';
    try {
      authorObject.forEach((author, i) => {
        if (author.literal) {
          authorField += author.literal[0].text;
          if (i < authorObject.length - 1) authorField += ' and ';
        }
        if (author.useprefix) {
          authorField += `${author.prefix[0].text} ${author.family[0].text}`;
          if (i < authorObject.length - 1) authorField += ' and ';
        }
        if (author.family && author.given) {
          authorField += `${author.family[0].text}, ${author.given[0].text}`;
          if (i < authorObject.length - 1) authorField += ' and ';
        }
      });
    } catch (err) {
      console.error('Author name parsing failed.', err);
    }
    return authorField;
  };

  const processPaper = async (paper) => {
    let error = false;
    let found = false;
    let newPaper;
    const p = paper.fields;
    try {
      newPaper = {
        name: p.title[0].text,
        doi: p.doi,
        abstract: (p.abstract) ? p.abstract[0].text : null,
        authors: parseAuthorsNames(p.author),
        journal: (p.journaltitle) ? p.journaltitle[0].text : null,
        paper_type: paper.bib_type
      };
    } catch (err) {
      return {
        paper: newPaper,
        found: false,
        error: true
      };
    }
    try {
      const data = await doesPaperExists(p.title[0].text);
      if (data.success) {
        found = data.found;
      }
      setProgress({ ...progress, counter: progress.counter + 1 });
    } catch (err) {
      error = true;
    }

    return {
      paper: newPaper,
      found,
      error
    };
  };

  const handleInputSubmission = async (e) => {
    const newFilename = e.target.value.split('\\').pop();
    let parsedPapers = [];
    const file = e.target.files.item(0);
    if (file) {
      setFilename(newFilename);
      const bib = await file.text();
      const parser = new BibLatexParser(bib, { processUnexpected: true, processUnknown: true });
      const newPapers = parser.parse();
      const nbPapers = Object.keys(newPapers.entries).length;
      if (nbPapers) {
        setProgress({ open: true, counter: 0, max: nbPapers });
        for (let i = 1; i < nbPapers; i++) {
          parsedPapers.push(processPaper(newPapers.entries[i]));
        }
        parsedPapers = await Promise.all(parsedPapers);
        setProgress({ ...progress, open: false });
        setPapers(parsedPapers);
      }
    }
  };

  const getCurrentAvatarIcon = (i) => {
    if (i === 0) return <AddIcon />;
    if (i === 1) return <DuplicateIcon />;
    if (i === 2) return <ErrorIcon />;
    return <div />;
  };

  const getPaperStats = () => {
    let stats = {
      'New papers': 0,
      Duplicates: 0,
      'Parsing error': 0
    };
    stats = papers.reduce((prev, curr) => {
      if (curr.found) return { ...prev, Duplicates: (prev.Duplicates + 1) };
      if (curr.error) return { ...prev, 'Parsing error': (prev['Parsing error'] + 1) };
      return { ...prev, 'New papers': (prev['New papers'] + 1) };
    }, stats);

    return (
      Object.keys(stats).map((stat, i) => {
        return (
          <ListItem key={stat}>
            <ListItemAvatar>
              <Avatar>
                {getCurrentAvatarIcon(i)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${stat}: ${stats[stat]}`}
            />
          </ListItem>
        );
      })
    );
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2" component="h2" gutterBottom>
        {getModalHeader()}
      </Typography>
      <Box mt={3}>
        <FormControl fullWidth className={classes.margin}>
          <Input
            id="file-name-input"
            value={filename}
            disabled
            startAdornment={(
              <InputAdornment position="start">
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Add file
                  </Button>
                  <input
                    accept=".bib"
                    id="contained-button-file"
                    onChange={handleInputSubmission}
                    type="file"
                    className={classes.input}
                  />
                </label>
              </InputAdornment>
            )}
          />
        </FormControl>
      </Box>
      { progress.open
        ? (
          <Box mt={3}>
            <LinearProgress variant="determinate" value={progress.counter / progress.max} />
          </Box>
        )

        : <div />}
      { papers.length
        ? (
          <Box mt={3}>
            <List>
              <Typography variant="h6" className={classes.title}>
                Import summary
              </Typography>
              <div className={classes.demo}>
                <List>
                  {getPaperStats()}
                </List>
              </div>
              <Button
                className={classes.saveButton}
                variant="contained"
                color="primary"
                component="span"
                onClick={() => saveHandler(papers
                  .filter((paper) => !paper.error && !paper.found)
                  .map((paper) => paper.paper))}
              >
                Save to study
              </Button>
            </List>
          </Box>
        ) : <div />}
    </Box>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="bibtex-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

BibtexModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  saveHandler: PropTypes.func
};
