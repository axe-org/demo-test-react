import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  Image,
  NativeModules,
  ScrollView
} from 'react-native'
import axe from 'axe-react'
import Toast from 'react-native-easy-toast'

export default class Home extends Component {
  constructor (props) {
    super(props)
    axe.navigation.setTitle('React')
    this.state = {
      account: '',
      login: '',
      modalVisible: false,
      image: '',
      registeredEventA: false,
      registeredLoginStatus: false
    }
  }
  login () {
    axe.router.route('axes://login/login')
  }
  register () {
    axe.router.route('axes://login/register')
  }
  loginCallback () {
    axe.router.route('axes://login/login', undefined, (payload) => {
      let userModel = payload.get('userInfo')
      this.refs.toast.show(`登录成功 ,信息如下 ：\n 帐号 : ${userModel.account} \n 等级: ${userModel.level} \n detailInfo: ${JSON.stringify(userModel.detailInfo)} \n tagList: ${userModel.tagList}`, 1500)
    })
  }
  registerCallback () {
    axe.router.route('axes://login/register', undefined, (payload) => {
      let userModel = payload.get('userInfo')
      this.refs.toast.show(`注册成功 ,信息如下 ：\n 帐号 : ${userModel.account} \n 等级: ${userModel.level} \n detailInfo: ${JSON.stringify(userModel.detailInfo)} \n tagList: ${userModel.tagList}`, 1500)
    })
  }
  loginWithPayload () {
    let payload = axe.data.create()
    payload.setString('account', '123455678')
    axe.router.route('axes://login/login', payload, (payload) => {
      let userModel = payload.get('userInfo')
      this.refs.top.show(`登录成功 ,信息如下 ：\n 帐号 : ${userModel.account} \n 等级: ${userModel.level} \n detailInfo: ${JSON.stringify(userModel.detailInfo)} \n tagList: ${userModel.tagList}`, 1500)
    })
  }
  setImage () {
    NativeModules.ImagePicker.pickImage((imgURL) => {
      this.setState({image: imgURL, modalVisible: true})
      setTimeout(() => {
        this.setState({modalVisible: false})
      }, 3000)
      axe.data.sharedData.setImage('image', imgURL)
    })
    // ImagePickerIOS.openSelectDialog({showImages: true, showVideos: false}, (imageUri, height, width) => {
    //   // this.refs.toast.show(imageUri)
    //   // this.setState({image: imageUri, modalVisible: true})
    //   ImageEditor.cropImage(imageUri, {offset: {x: 0, y: 0}, size: {width: width, height: height}}, (tag) => {
    //     ImageStore.getBase64ForTag(tag, (base64ImageData) => {
    //       this.refs.top.show(base64ImageData.substr(0, 20))
    //       console.log('success')
    //       console.log(base64ImageData.substr(0, 20))
    //     }, (error) => {
    //       console.log('error')
    //       console.log(error)
    //     })
    //   }, () => {})
    // }, () => {})
  }
  getImage () {
    axe.data.sharedData.get('image', (imgURL) => {
      if (imgURL) {
        this.setState({image: imgURL, modalVisible: true})
        setTimeout(() => {
          this.setState({modalVisible: false})
        }, 3000)
      } else {
        this.refs.top.show('当前为设置 key 为 image 的图片！！！', 1500)
      }
    })
  }
  setBasicData () {
    axe.data.sharedData.setNumber('number', 3)
    axe.data.sharedData.setBoolean('boolean', true)
    axe.data.sharedData.setString('string', 'react-native')
    axe.data.sharedData.setArray('array', ['r', 'e', 'c'])
    axe.data.sharedData.setObject('object', {type: 'react', api: 'difficult'})
    this.refs.top.show('设置基础数据！！', 1500)
  }
  getBasicData () {
    let message = ''
    // TODO 回调地狱，还是要把异步操作用promise包装一下。
    axe.data.sharedData.get('number', (n) => {
      message += `number : ${n} \n`
      axe.data.sharedData.get('boolean', (b) => {
        message += `boolean : ${b} \n`
        axe.data.sharedData.get('string', (s) => {
          message += `string : ${s} \n`
          axe.data.sharedData.get('array', (a) => {
            message += `array : ${a} \n`
            axe.data.sharedData.get('object', (o) => {
              message += `object : ${JSON.stringify(o)} `
              this.refs.top.show(message, 1500)
            })
          })
        })
      })
    })
  }
  getModel () {
    axe.data.sharedData.get('model', (model) => {
      if (model) {
        let message = ''
        message += `string : ${model.string} \n`
        message += `number : ${model.number} \n`
        message += `map : ${JSON.stringify(model.map)} \n`
        message += `list : ${model.list} \n`
        this.refs.top.show(message)
      } else {
        this.refs.top.show('当前未设置 相应键值的model类型 ！', 1500)
      }
    })
  }
  setModel () {
    let model = {
      string: 'react',
      number: 10086,
      map: null, // 对于空值， 一定要设置 null。
      list: ['123']
    }
    axe.data.sharedData.setModel('model', model)
    this.refs.top.show('设置 model 类型！', 1500)
  }
  setDate () {
    let date = new Date()
    axe.data.sharedData.setDate('date', date)
    this.refs.top.show('设置当前时间！', 1500)
  }
  getDate () {
    axe.data.sharedData.get('date', date => {
      this.refs.top.show('date : ' + date, 1500)
    })
  }
  removeDate () {
    axe.data.sharedData.removeItem('date')
    this.refs.top.show('成功删除 key 为 date 的数据 ！', 1500)
  }

  reigsterEventA () {
    // 在多页面应用中，不用过于担心 event的问题， 但是还是要确保，尽量不要重复监听。
    if (this.state.registeredEventA) {
      this.refs.top.show('已注册监听', 1500)
    } else {
      axe.event.registerListener('eventA', () => {
        this.refs.top.show('eventA !!!!', 1500)
      })
      this.refs.top.show('成功注册监听！！', 1500)
      this.state.registeredEventA = true
    }
  }
  removeEventA () {
    axe.event.removeListener('eventA')
    this.state.registeredEventA = false
    this.refs.top.show('成功注销！', 1500)
  }
  postEventA () {
    axe.event.postEvent('eventA')
  }
  listenToLoginStatus () {
    if (this.state.registeredLoginStatus) {
      this.refs.top.show('已注册监听', 1500)
    } else {
      let msg
      axe.event.registerListener('LoginStatusChange', (payload) => {
        if (payload.get('login')) {
          let userInfo = payload.get('userInfo')
          msg = `登录成功 ,信息如下 : 帐号 : ${userInfo.account} 等级: ${userInfo.level} \n detailInfo: ${JSON.stringify(userInfo.detailInfo)} \n tagList: ${JSON.stringify(userInfo.tagList)}`
        } else {
          msg = '退出登录！！'
        }
        // 这个toast。。。
        console.log(msg)
        this.refs.toast.show(msg, 1500)
      })
      this.refs.top.show('成功注册监听！！', 1500)
      this.state.registeredLoginStatus = true
    }
  }
  removeLoginListener () {
    axe.event.removeListener('LoginStatusChange')
    this.state.registeredLoginStatus = false
    this.refs.top.show('成功注销！', 1500)
  }
  logOut () {
    axe.data.sharedData.removeItem('userInfo')
    let payload = axe.data.create()
    payload.setBoolean('login', false)
    axe.event.postEvent('LoginStatusChange', payload)
  }
  render () {
    return (
      <View style={{flex: 1}}>
        <Toast ref='toast' position='center' />
        <Toast ref='top' position='top' />
        <ScrollView style={styles.container} contentContainerStyle={{alignItems: 'stretch', paddingBottom: 15, paddingTop: 10}}>

          <Modal
            animationType={'fade'}
            transparent
            visible={this.state.modalVisible}
          >
            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Image style={{ width: 250, height: 250, resizeMode: Image.resizeMode.stretch }} source={{ uri: this.state.image }} />
            </View>
          </Modal>

          <TouchableHighlight style={styles.button} onPress={this.login.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>login</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.register.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>register</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.loginCallback.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>login with callback</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.registerCallback.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>register with callback</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.loginWithPayload.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>login(123455678)</Text>
          </TouchableHighlight>

          <View style={{height: 30}} />
          <TouchableHighlight style={styles.button} onPress={this.setImage.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>setImage</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.getImage.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>getImage</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.setBasicData.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>setBasicData</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.getBasicData.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>getBasicData</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.setModel.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>setModel</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.getModel.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>getModel</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.setDate.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>setDate</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.getDate.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>getDate</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.removeDate.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>remove('date')</Text>
          </TouchableHighlight>

          <View style={{height: 30}} />
          <TouchableHighlight style={styles.button} onPress={this.reigsterEventA.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>reigsterEventA</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.removeEventA.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>removeEventA</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.postEventA.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>postEventA</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.listenToLoginStatus.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>listenToLoginStatus</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.removeLoginListener.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>removeLoginListener</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.logOut.bind(this)} underlayColor='#66C1FF'>
            <Text style={styles.btntitle}>logOut</Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  formitem: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10
  },
  forminput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    width: 220,
    paddingLeft: 5,
    paddingRight: 5
  },
  label: {
    width: 50,
    fontSize: 16.5,
    color: '#333333',
    textAlign: 'center'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  button: {
    backgroundColor: '#0C9EFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 4,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 10
  },
  btntitle: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  }
})
