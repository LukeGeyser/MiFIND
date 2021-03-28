import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }) => <div> <h3 className='Marker'>{text}</h3></div>;
 
export class SimpleMap extends Component {

    createMapOptions = function (map) {
        return {
          panControl: true,
          mapTypeControl: false,
          disableDefaultUI: true,
          scrollwheel: true,
          mapTypeId: 'satellite',
        }
      }

    static defaultProps = {
        center: {
        lat: -34.161659,
        lng: 24.827080
        },
        zoom: 11,
        
    };
    
    render() {
        return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCosxNjfVMrjaqAju2xZvPPHqpnzWt3148" }}
            defaultCenter={this.props.center}
            options={ this.createMapOptions }
            defaultZoom={this.props.zoom}
            >
            <AnyReactComponent
                lat={-34.161659}
                lng={24.827080}
                text="My Marker"
            />

            </GoogleMapReact>
        </div>
        );
    }
}