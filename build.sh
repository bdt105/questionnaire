rm -rf $2
mkdir $2
cp .htaccess $2

ng build --bh $1 --output-path $2 --target=production --delete-output-path=false