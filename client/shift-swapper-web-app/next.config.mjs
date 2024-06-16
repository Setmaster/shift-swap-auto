/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
    async rewrites() {
        return [
            {
                source: '/api/notifications/:path*',
                destination: 'http://shift-swap-notifications-service:80/:path*',
            },
        ];
    },
};

export default nextConfig;
