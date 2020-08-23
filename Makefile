all:
	npm run build && sed -i -e 's/href="\//href=\"/g' ./build/* && sed -i -e 's/src="\//src=\"/g' ./build/* && sed -i -    e 's/src="\//src=\"/g' ./build/* 
fix:
	sed -i -e 's/href="\//href=\"/g' ./build/* && sed -i -e 's/src="\//src=\"/g' ./build/* && sed -i -    e 's/src="\//src=\"/g' ./build/* 
