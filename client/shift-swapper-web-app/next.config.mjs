/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: [
            'cdn.pixabay.com',
            'shift-swap-imgs.s3.us-east-1.amazonaws.com',
        ],
    },
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true, // needed because of issues on nextAuths and reactflow end 
    },
    reactStrictMode: false,
    productionBrowserSourceMaps: process.env.NEXT_PRODUCTION_BROWSER_SOURCEMAPS === 'true',
};

export default nextConfig;
