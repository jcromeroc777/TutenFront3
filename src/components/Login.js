import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useForm } from "react-hook-form";

import { patternEmail } from './../utils/validations';

import API from './../api/api';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function Login(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(false);

  const { register, setValue, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    
    const headers = {
      'Accept': 'application/json',
      'password': data.password,
      'app': 'APP_BCK'
    }

    API.put(`/TutenREST/rest/user/testapis%40tuten.cl?email=${data.email}`, null, {
      headers: headers
    })
    .then((response) => {
      console.log(response.data.sessionTokenBck);
      props.setToken(response.data.sessionTokenBck);
      setToken(response.data.sessionTokenBck);
      setLoading(false);
      setError(false);
    }).catch((error) => {
      setLoading(false);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    });
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
        register(
            { name: "email"}, 
            { required: { value: true, message: 'Correo vacío'}, 
            pattern: { value: patternEmail, message: 'Correo inválido'} });
        register(
            { name: "password"}, 
            { required: { value: true, message: 'Contraseña vacía'} });
    }

    return () => { isMounted = false };
  }, [register]);

  if (token) {
    return <Redirect to={{ pathname: '/dashboard', state: { token }}} />
  }
  
  return (
    <Container component="main" maxWidth="xs">
      { error ?
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Credenciales inválidas
      </Alert> :
      null
      }
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : ""}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setValue("email", e.target.value, true)}
          />
          <TextField
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : ""}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Clave"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setValue("password", e.target.value, true)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {loading ? <CircularProgress color="secondary" size="2em"/> : "Entrar"}
          </Button>
        </form>
      </div>
    </Container>
  );
}