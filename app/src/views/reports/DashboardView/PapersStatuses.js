import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import {
  PriorityHigh as PriorityHighIcon,
  Cached as CachedIcon,
  Done as DoneIcon,
  HelpOutline as HelpOutlineIcon,
  Clear as ClearIcon
} from '@material-ui/icons/';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const PapersStatuses = ({ className, papers }) => {
  const classes = useStyles();
  const theme = useTheme();

  const getEmptySum = () => {
    return [0, 0, 0, 0, 0];
  };

  const [statusesSums, setStatusesSums] = useState(getEmptySum());

  useEffect(() => {
    const newStatusesSums = getEmptySum();
    for (let i = 0; i < papers.length; i++) {
      if (Object.keys(papers[i]).includes('status')) newStatusesSums[parseInt(papers[i].status, 10)] += 1;
      else newStatusesSums[4] += 1;
    }
    setStatusesSums(newStatusesSums);
  }, [papers]);

  const data = {
    datasets: [
      {
        data: statusesSums,
        backgroundColor: [
          '#3f51b5',
          'orange',
          'green',
          '#f50057',
          colors.grey[600],
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Just added', 'In progress', 'Done', 'Need help', 'Unknown']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Just added',
      value: statusesSums[0],
      icon: PriorityHighIcon,
      color: '#3f51b5'
    },
    {
      title: 'In progress',
      value: statusesSums[1],
      icon: CachedIcon,
      color: 'orange'
    },
    {
      title: 'Done',
      value: statusesSums[2],
      icon: DoneIcon,
      color: 'green'
    },
    {
      title: 'Need help',
      value: statusesSums[3],
      icon: HelpOutlineIcon,
      color: '#f50057'
    },
    {
      title: 'Unknown',
      value: statusesSums[4],
      icon: ClearIcon,
      color: colors.grey[600]
    }
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Papers states" />
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              p={1}
              textAlign="center"
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

PapersStatuses.propTypes = {
  className: PropTypes.string,
  papers: PropTypes.array
};

export default PapersStatuses;
