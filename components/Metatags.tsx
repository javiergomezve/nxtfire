import Head from 'next/head';

const Metatags = ({title, description, image}) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@javiergomezve" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
        </Head>
    );
};

Metatags.defaultProps = {
    title: 'The Full Next.js + Firebase Course',
    description: 'A complete Next.js + Firebase course by Fireship.io',
    image: 'https://fireship.io/courses/react-next-firebase/img/featured.png',
};

export default Metatags;
