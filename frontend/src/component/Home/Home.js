import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./Product.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
//import ProductCard from './ProductCard';


const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="MyStore" />

          <div className="banner">
            <p>Welcome to MyStore</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;



//      DUMMY Data
/*
    const product = {
  name: "Drone for kids",
  price: "INR 4500",
  _id: "somerandomid12331",
  images: [
    {
      url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.conservationindia.org%2Fwp-content%2Ffiles_mf%2Fdrone-CI-1.jpeg&f=1&nofb=1&ipt=96d390744a087671caff8f8bf36f071cca63342cff72f63391ca9bd09c2d165b&ipo=images",
    },
  ],
};
*/