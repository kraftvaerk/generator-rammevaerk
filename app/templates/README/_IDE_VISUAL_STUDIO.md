## Run using Visual Studio 2015

Make sure that your external web tools are pointing in the right directory.

1. First, find the Node.js installation. By default, Node.js installs to `C:\Program Files\nodejs`,
2. Go to `Tools > Options` in Visual Studio.
3. In this dialog, go to `Projects and Solutions > External Web Tools` to open the dialog that manages all of the 3rd party tools used within Visual Studio.
4. Add an entry at the top to the path to the global Node.js directory to force Visual Studio to use that version instead.

Open the solution up and it should start watching files and run the tasks accordingly. A build will be triggered after the build command is run in Visual Studio.
