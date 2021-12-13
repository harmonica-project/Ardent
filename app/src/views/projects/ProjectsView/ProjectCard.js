import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
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
  console.log(project);
  const classes = useStyles();

  const disableDelete = (() => {
    if (!localStorage.getItem('danger') || localStorage.getItem('danger') === 'false') return true;
    return false;
  })();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          { project.name }
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          { project.url }
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => action('view', project)}>
          View project
        </Button>
        { project.is_admin ? (
          <Button size="small" color="primary" onClick={() => action('edit', project)}>
            Manage project
          </Button>
        ) : <div />}
        { !disableDelete && project.is_admin ? (
          <Button size="small" color="primary" onClick={() => action('delete', project)}>
            Delete project
          </Button>
        ) : <div />}
      </CardActions>
    </Card>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    is_admin: PropTypes.bool
  }),
  action: PropTypes.func
};
