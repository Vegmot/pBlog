import React from 'react';

const PostForm = () => {
  const onSubmit = () => {};
  return (
    <form onSubmit={onSubmit}>
      <input type='text' name='title' placeholder='Enter title' />
      <textarea name='content' cols='30' rows='10'></textarea>
    </form>
  );
};

export default PostForm;
