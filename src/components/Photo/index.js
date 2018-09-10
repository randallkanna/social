import React, { Component } from 'react'
import './style.css'
import Fund from '../../../build/contracts/Fund.json';
import getWeb3 from '../../utils/getWeb3'
// import ipfs from './ipfs';

class Photo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      fundAmount: 0,
      account: null,
    }

    this.setStateValues = this.setStateValues.bind(this);
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const fund = contract(Fund)
    fund.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      fund.deployed().then((instance) => {
        this.fundInstance = instance
        this.setState({ account: accounts[0] });
      })
    })
  }

  sendFunds(event, fund) {
    event.preventDefault();
    var inWei = this.state.web3.toWei(this.state.fundAmount, 'ether');

    console.log(`Fund: ${fund.ipfsStorageHash}`);

    // need to get the address of the photo
    this.fundInstance.sendToPhoto(fund.address, {from: this.state.account, value: inWei, gas: 470000, gasPrice: this.state.web3.toWei(1, 'gwei')});
  }

  setStateValues(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <div className="photo">
        <img src={`https://ipfs.io/ipfs/${this.props.photo}`} alt=""/>

        <form onSubmit={(e) => {this.sendFunds(e, this.props.fund)}}>
          <input type="number" name="fundAmount" value={this.state.fundAmount} onChange={(e) => this.setStateValues(e)} />
          <input type="submit" / >
        </form>
      </div>
    )
  }
}

export default Photo
