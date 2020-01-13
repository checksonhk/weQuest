import React, { useState, useContext, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { apps, flash, list, add } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import Tab1 from './pages/Tab1';
import NewRequest from './pages/NewRequest';
import LoginScreen from './pages/LoginScreen';
import RequestFeed from './pages/RequestFeed';
import Profile from './pages/Profile';
import ActivityFeed from './pages/ActivityFeedRouter';
import ProtectedRoute from './Routes/ProtectedRoute';
import { AuthContext } from './contexts/authContext';
import Spinner from './components/Spinner';
import axios from 'axios';

export default function Router(props) {
  const [initialRender, setinitialRender] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  const getCurrentState = async e => {
    const _user = await axios.get('/api/users');
    setUser(prev => (prev && _user.data && prev.id === _user.data.id ? prev : _user.data || null));
    setinitialRender(false);
  };

  useEffect(() => {
    getCurrentState();
  }, [user]);

  return initialRender ? (
    <Spinner message='weQuest'></Spinner>
  ) : (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path='/tab1' component={Tab1} exact={true} />
          <Route path='/request/new' component={NewRequest} exact={true} />
          <Route path='/activity' component={ActivityFeed} />
          <Route path='/requests' component={RequestFeed} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/' render={() => <Redirect to='/tab1' />} exact={true} />
          <ProtectedRoute path='/profile' component={Profile} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot='bottom'>
          <IonTabButton tab='tab1' href='/tab1'>
            <IonIcon icon={flash} />
            <IonLabel>Tab One</IonLabel>
          </IonTabButton>
          <IonTabButton tab='requestFeed' href='/requests'>
            <IonIcon icon={list} />
            <IonLabel>Request Feed</IonLabel>
          </IonTabButton>
          <IonTabButton tab='newRequest' href='/request/new'>
            <IonIcon icon={add} />
            <IonLabel>New Request</IonLabel>
          </IonTabButton>
          <IonTabButton tab='activityFeed' href='/activity'>
            <IonIcon icon={list} />
            <IonLabel>Activity</IonLabel>
          </IonTabButton>
          <IonTabButton tab='tab4' href='/profile'>
            <IonIcon icon={apps} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
