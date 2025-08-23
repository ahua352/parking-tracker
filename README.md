# Parking Tracker App 👋

This is an expo app which allows you to keep track of parking-related data.

## Dev setup

1. Add an .env file into the root directory and provide a `GOOGLE_MAPS_API_KEY` value.

2. Install dependencies:

   ```
   npm install
   ```

3. Start the app:

   ```
    npx expo start
   ```

## Preview setup

### Generate new build

```
eas build -p android --profile preview
```

### Update build

```
eas update --branch preview
```
