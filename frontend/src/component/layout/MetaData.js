import React from "react";
import Helmet from "react-helmet";

//Purpose: In our application, all the pages that we load will have their own title provided by this class.
const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default MetaData;