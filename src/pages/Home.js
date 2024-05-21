import Banner from '../components/Banner';

import FeaturedProducts from '../components/FeaturedProducts';


export default function Home() {

    const data = {
        title: "E-Commerce App",
        content: "Quality Products for All",
        destination: "/products/active",
        label: "Add to cart!"
    }

    return (
        <>
            <Banner data={data}/>
            <FeaturedProducts />        
        </>
    );
}