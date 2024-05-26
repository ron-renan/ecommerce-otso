import { useContext } from 'react';
import UserContext from '../UserContext';
import UserOrders from '../components/UserOrders';
import AllOrders from '../components/AllOrders';

export default function Order() {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user.isAdmin ? <AllOrders /> : <UserOrders />}
    </div>
  );
}
