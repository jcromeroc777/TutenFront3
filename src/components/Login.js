import React, { useState, useEffect } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useForm } from "react-hook-form";

import { patternEmail } from './../utils/validations';

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


export default function SignIn() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const { register, setValue, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    console.log(data.email, data.password);
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

  return (
    <Container component="main" maxWidth="xs">
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
            Entrar
          </Button>
        </form>
      </div>
    </Container>
  );
}