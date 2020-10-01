import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ title, icon }) => {
  const authLinks = (
    <Fragment>
      <li>Welcome user!</li>
      <a href='#!'>
        <i className='fas fa-sign-out-alt'></i> Logout
      </a>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div className='navbar bg-primary'>
      <h1>
        <Link to='/'>
          <i className={icon}></i> {title}
        </Link>
      </h1>
      <ul>{1 > 2 ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.defaultProps = {
  title: 'Blog',
  icon: 'fas fa-book',
};

export default Navbar;
