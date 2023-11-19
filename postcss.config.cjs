module.exports = ({ env }) => ({
  plugins: [require('autoprefixer')(), require('postcss-sort-media-queries')()],
});
