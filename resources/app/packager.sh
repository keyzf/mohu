platform=$1 # 操作系统名称: win32 或 linux
if [ $2 ]
then
   arch=$2 # 系统构架: x64 或 ia32 或 arm64 或 armv7l
else
   arch=x64
fi

electron-packager . MohuAPP --platform=${platform} --arch=${arch}  --out ../../OutApp/ --electron-version 2.0.4 --overwrite --icon=./logo.ico --tmpdir=../../OutApp/Temp/ 
cd ../../OutApp/MohuAPP-${platform}-${arch}
rm LICENSE LICENSES.chromium.html version

if [ ${platform} != "win32" ]
then
#    echo ${platform}
    rm resources/app/auto_uac_add_hosts.exe
fi

cd ../ # 在OutApp文件夹
electron-installer-zip MohuAPP-${platform}-${arch} ../dist/MohuAPP-${platform}-${arch}.zip

