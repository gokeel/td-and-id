#! /bin/bash

for i in `grep -inr "icon-left" src/pages/* | awk -F":" '{print $1}' | sort -u`
do
	sed -i 's/icon-left/icon-start/g' $i
done
