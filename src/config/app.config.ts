export const AppConfig = () => ({
  appPort: +process.env['PORT'] || 4000,
  storageConnectionString:
    process.env['STORAGE_CONNECTION_STRING'] || 'UseDevelopmentStorage=true',
});
