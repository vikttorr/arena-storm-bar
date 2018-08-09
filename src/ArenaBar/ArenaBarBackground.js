import React, { PureComponent, Component } from 'react';
import { Transition } from 'react-spring';
import './ArenaBarBackground.css';

export default class ArenaBarBackground extends PureComponent {

  render() {
    const { state } = this.props;
   
    const states = {
      storm: ['https://a.imgdropt.com/image/ec0f931e-9a5f-4bc7-925f-2bc2685b3702', 'https://i.redditmedia.com/h5QnLsCpyaZxnvwdFZ_VF6xuqskyZCX57Z_uwYzsaF0.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=ace20b206d53555a7c82ebaf9456c518'],
      default: ['test', 'test']
    }
    
    const images = states[state] ? states[state] : states['default']

    return <BackgroundAnimation images={images}/>
  }
}


class BackgroundAnimation extends Component {

  state = { 
    images: ['https://a.imgdropt.com/image/ec0f931e-9a5f-4bc7-925f-2bc2685b3702', 'https://i.redditmedia.com/h5QnLsCpyaZxnvwdFZ_VF6xuqskyZCX57Z_uwYzsaF0.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=ace20b206d53555a7c82ebaf9456c518'],
    index:0,
  }

  componentDidMount() {
    const { images } = this.props;
    const { index } = this.state;
    this.loop = setInterval(() => {
      console.log("loop", {inxed: index, imgs: images.length})
      if(index+1 >= images.length-1){
        return this.setState({index:0}, () => console.log("index 0"))        
      }
      return this.setState({index:index+1}, () => console.log('index +1'))
    }, 2000)
  }

  componentWillUnmount() {
    if(this.loop) { 
      clearInterval(this.loop)
    } 
  }

  render(){
    const { index } = this.state;
    const { images } = this.props;
    
    const _images = [];
    images.forEach(image => {
      const renderFunc = style => <img src={image} className='arena-bar-background__img' style={style}/> 
      _images.push(renderFunc)
    })


    return <div className='arena-bar-background'>  
      <Transition native keys={_images} from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {_images[index]}
      </Transition>
    </div>
  }
}
