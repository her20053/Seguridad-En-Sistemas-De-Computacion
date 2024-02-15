import React, { useState, useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import LoginIllustration from '../assets/Login Illustration.png';

import { Card, Avatar, Text, Group, Button } from '@mantine/core';

import classes from './UserCardImage.module.css';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    padding: '10px',
    margin: '10px 0',
    marginTop: '50px',
    borderRadius: '5px',
    border: 'none',
    color: '#fff',
    backgroundColor: '#007BFF',
    cursor: 'pointer',
  }
};

const stats = [
  { value: '34K', label: 'Followers' },
  { value: '187', label: 'Follows' },
  { value: '1.6K', label: 'Posts' },
];

export const HomePage = () => {

  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (e) {
        console.error(e);
      }
    };

    if (isAuthenticated) {
      getToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  const obtenerAccessToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      return accessToken;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const realizarSolicitudConAccessToken = async () => {
    const url = "http://127.0.0.1:4000/protected";

    console.log('Realizando solicitud con accessToken a la url: ', url);

    const accessToken = await obtenerAccessToken(); // Asegúrate de obtener el accessToken como se mostró antes

    console.log('accessToken: ', accessToken);

    if (!accessToken) {
      console.log("No se pudo obtener el accessToken.");
      return;
    }

    try {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error('Respuesta de red no fue ok.');
      }

      const data = await response.json();
      console.log(data); // Procesa los datos recibidos según sea necesario
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <div>
      {!isAuthenticated &&
        (
          <div>
            <div style={styles.container}>
              <img src={LoginIllustration} alt="Login Illustration" style={{ width: '40%' }} />
              <h1>Implementación Open ID connect</h1>
              <button onClick={() => loginWithRedirect()} style={styles.button}>Iniciar sesión con Auth0</button>
            </div>
          </div>
        )}
      {
        isAuthenticated && (
          <div>
            <Card withBorder padding="xl" radius="md" className={classes.card}>
              <Card.Section
                h={350}
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1707539159922-4dd677be4924?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
              />
              <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
                size={80}
                radius={80}
                mx="auto"
                mt={-30}
                className={classes.avatar}
              />
              <Text ta="center" fz="lg" fw={500} mt="sm">
                {user.name}
              </Text>
              <Text ta="center" fz="sm" c="dimmed">
                {user.email}
              </Text>
              <Group mt="md" justify="center" gap={30}>
                {items}
              </Group>
              <button onClick={() => logout({ returnTo: window.location.origin })} style={styles.button}>
                Cerrar sesión
              </button>
              <Button onClick={realizarSolicitudConAccessToken} variant="light" color="blue">
                Realizar solicitud con accessToken
              </Button>
            </Card>

          </div>
        )

      }
    </div>
  );
};

