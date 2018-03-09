import React, { Component } from 'react';
import { connect } from 'react-redux';
import { random, find } from 'lodash';
import logo from './logo.svg';
import './Main.css';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AlbumList from '../albums-list';
import AddAlbumDialog from '../add-album';
import EditAlbumDialog from '../edit-album';
import Search from '../search';
import Wait from '../wait';

class Main extends Component {
	state = {
		drawCount: 1
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Albums</h1>
				</header>
				<div className="App-intro">
					<div className="search">
						<Search />
					</div>
					<RaisedButton label="Dodaj album" primary={true} onClick={() => this.props.showAddDialog()} style={{height: 'auto'}} />
					<FlatButton label="Losuj: " onClick={() => this._draw()} /> 
					<TextField id="drawn-count" value={this.state.drawCount} style={{width: '40px'}} onChange={event => this.setState({drawCount: event.target.value})} />
					<FlatButton label="Resetuj" onClick={() => this.props.reset()} /> 
					<AlbumList />
					<Wait show={this.props.serverWait} />
				</div>
				<AddAlbumDialog />
				<EditAlbumDialog />
			</div>		
		);
	}

	_draw() {
		const { items } = this.props;
		let drawCount = parseInt(this.state.drawCount, 10);

		if (isNaN(drawCount)) {
			drawCount = 1;
		}

		const count = (drawCount > items.length ? items.length : drawCount);
		const drawn = [];

		while (drawn.length < count) {
			const i = random(0,  items.length - 1);

			if (!find(drawn, drawnItem => drawnItem.id === items[i].id)) {
				drawn.push(items[i]);
			}		
		}

		this.props.setDrawn(drawn);
	}

}

const mapStateToProps = (state, props) => {
	return {
		items: state.list.items || {},
		serverWait: state.appState.serverWait || false
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showAddDialog: () => {
			dispatch({type: 'showAddDialog'}); 
		},
		setDrawn: drawn => {
			dispatch({type: 'setDrawn', drawn})
		},
		reset: drawn => {
			dispatch({type: 'reset'})
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);