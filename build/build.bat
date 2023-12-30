echo "Start for build"

cd ./build
rm -rf build.zip
CALL npm prune --production
zip -r build.zip ../ -x @build-exclude.lst
CALL npm install -D

exit