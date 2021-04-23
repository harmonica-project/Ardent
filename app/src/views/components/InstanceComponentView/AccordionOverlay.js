import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InstancePropertiesTable from './InstancePropertiesTable';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function AccordionOverlay({ properties, propertyActionHandler }) {
  const classes = useStyles();
  const [filtered, setFiltered] = useState({});
  const [expanded, setExpanded] = useState('');

  const filterByCategory = () => {
    const newFiltered = {};

    properties.forEach((prop) => {
      const category = (prop.category ? prop.category.charAt(0).toUpperCase() + prop.category.slice(1) : 'Other');

      if (newFiltered[category]) {
        newFiltered[category].push(prop);
      } else {
        newFiltered[category] = [prop];
      }
    });

    setFiltered(newFiltered);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    filterByCategory();
  }, [properties]);

  return (
    <div className={classes.root}>
      {Object.keys(filtered).map((category) => {
        return (
          <Accordion expanded={expanded === category} onChange={handleChange(category)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${category}-content`}
              id={`${category}-header`}
            >
              <Typography className={classes.heading}>{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <InstancePropertiesTable
                properties={filtered[category]}
                propertyActionHandler={propertyActionHandler}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

AccordionOverlay.propTypes = {
  properties: PropTypes.array,
  propertyActionHandler: PropTypes.func
};
