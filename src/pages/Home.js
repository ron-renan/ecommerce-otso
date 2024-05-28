import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import LandingPage from '../components/LandingPage.js'


export default function Home() {

    const data = {
        title: "E-Commerce App",
        content: "Quality Products for All",
        destination: "/products",
        label: "More Products!"

    }

    return (
        <>
            <LandingPage />
            {/*<Banner data={data}/>*/}
            <FeaturedProducts />        
        </>
    );
}