module.exports = {
  stories: ['../stories/*.story.tsx'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  addons: ['@storybook/addon-webpack5-compiler-swc'],
};
