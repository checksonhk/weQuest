import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Login from '../components/User/Login';
import Register from '../components/User/Register';
import {
  IonSegment,
  IonContent,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  useIonViewWillEnter,
} from '@ionic/react';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';
import './LoginScreen.scss';

const LoginScreen = props => {
  const [segment, setSegment] = useState('login');
  const { user, setUser } = useContext(AuthContext);
  const history = useHistory();

  // const getCurrentState = async e => {
  //   axios.get('/api/users').then(user => {
  //     setUser(user.data);
  //     if (user) {
  //       history.push('/profile');
  //     }
  //   });
  // };

  // useIonViewWillEnter(() => {
  //   getCurrentState();
  // });

  return (
    <IonPage id='login-page'>
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonToolbar className='login-toolbar'>
        <IonSegment onIonChange={e => setSegment(e.detail.value)}>
          <IonSegmentButton value='login' checked={segment === 'login'}>
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='register' checked={segment === 'register'}>
            <IonLabel>Register</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      {segment === 'login' ? <Login></Login> : <Register></Register>}
    </IonPage>
  );
};

export default LoginScreen;
