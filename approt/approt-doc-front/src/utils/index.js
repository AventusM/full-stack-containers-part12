export const mapLinkToBackend = (path) => {
  console.log('path', path);
  return `${process.env.REACT_APP_BACKEND_BASEURL}/${path}`;
};
