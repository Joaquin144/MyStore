import React, { Fragment } from 'react'
import {CgMouse} from 'react-icons/cg';
import './Home.css'
import Product from './Product.js';

const product = {
    name: "Drone for kids",
    price: "INR 4500",
    _id: "somerandomid12331",
    images: [{ url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.conservationindia.org%2Fwp-content%2Ffiles_mf%2Fdrone-CI-1.jpeg&f=1&nofb=1&ipt=96d390744a087671caff8f8bf36f071cca63342cff72f63391ca9bd09c2d165b&ipo=images' }],
}

const Home = () => {
  return <Fragment>
    <div className='banner'>
        <p>Welcome to MyStore</p>
        <h1>Find Amazing products offered at cheap prices</h1>
        <a href='#container'>
            <button>
                Scroll <CgMouse />
            </button>
        </a>
    </div>

    <h2 className='homeHeading'>Featured Products</h2>

    <div className='container' id='container'>
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
    </div>
  </Fragment>
}

export default Home