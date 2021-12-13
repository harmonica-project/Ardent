import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    margin: '10px'
  },
});

export default function ProjectCard({ project, action }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            { project.name }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            { project.description }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => action('view', project)}>
          View project
        </Button>
        <Button size="small" color="primary" onClick={() => action('edit', project)}>
          Manage project
        </Button>
      </CardActions>
    </Card>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string
  }),
  action: PropTypes.func
};
