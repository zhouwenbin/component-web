1、执行打包。进入haitao-b2c-web目录执行如下命令

    ```
    grunt build:dev
    ```

2、文件压缩。进入dist目录，执行zip压缩

    ```
    cd dist
    zip -r dist.zip ./*
    ```

3、文件上传。文件上传到lichunmin用户

    ```
    scp dist.zip lichunmin@115.28.145.123:/home/lichunmin/jiyanliang
    ```

4、文件拷贝。使用lichunmin用户登录开发环境115.28.145.123，执行如下命令

    ```
    ssh lichunmin@115.28.145.123
    cd jiyanliang
    sudo cp dist.zip /home/admin/statics
    ```

5、文件解压。切换到admin用户下，进入statics目录后，确认有dist文件，使用admin用户执行解压

    ```
    sudo su admin
    cd
    cd statics
    unzip -o -d /home/admin/statics dist.zip
    ```

