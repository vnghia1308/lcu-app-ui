/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/lcu/app/3.0.2-20250301_1',
    output: 'export',
    compiler: {
        styledComponents: true,
    },
    reactStrictMode: false
}

module.exports = nextConfig
