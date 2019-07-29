origin=../frontend/src
target=$(pwd)/src

mkfile()
{
    mkdir -p "$(dirname "$1")" || return;
    touch "$1";
}

dirof()
{
    echo $(dirname $1)
}

replace_path()
{
    local path=$(echo $1 | awk -F $origin '{print $2}');
    echo "${target}${path}"
}

cp $origin/App.js $target/App.js
cp $origin/app-config.js $target/app-config.js
if [ ! -f "$target/app-ui.js" ]
then
    touch $target/app-ui.js
    cat ./ui-template.js > $target/app-ui.js
fi

cp -r $origin/utils/ $target/

files=$(find $origin/components/ -maxdepth 9999 -name "index.js")
for origin_file in $files
do
    target_file=$(replace_path $origin_file)

    if [ ! -f "$target_file" ]
    then
        mkfile $target_file
    fi

    target_dir=$(dirof $target_file)
    target_ui_file="$target_dir/$(basename $target_dir)-ui.js"
    if [ ! -f "$target_ui_file" ]
    then
        mkfile $target_ui_file
        cat ./ui-template.js > $target_ui_file
    fi
    cat $origin_file > $target_file
done

unset origin
unset target
unset target_file
unset target_dir
unset target_ui_file
