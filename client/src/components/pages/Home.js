import React, { Fragment } from 'react';
import Posts from '../posts/Posts';

const Home = (props) => {
  return (
    <Fragment>
      <h1 className='text-primary'>{props.head}</h1>
      <p>{props.body}</p>
      <Posts />
    </Fragment>
  );
};

Home.defaultProps = {
  head: 'Home Sweet Home',
  body: "Because it's home",
};

export default Home;
