import React, { Component } from 'react'
import { connect } from 'react-redux'
import Popup from "reactjs-popup";
import {utils as web3Utils} from 'web3';

import { getWallet, sendSignedTransaction, getTransactionStatus, contractMethod, getBalance, getData, getGasLimit, getSignedTransaction } from '../utils/web3'

import Notification from '../components/Notification';

import { userLogout, userChangeInfo } from '../actions/user'
import { startLoading, endLoading } from '../actions/preloader'

class Header extends Component {
    state = {
        popupOpen: false,
        balance: '',
        changeInfoDev: {
            step: 1,
            password: '',
            hash: '',
            gasLimit: '',
            data: '',
            params: {
                name: '',
                info: ''
            }
        }
    };

    async componentDidMount(){}

    handleClickLogout = () => {
        this.props.userLogout();
    };

    openModal = async e => {
        e.preventDefault();
        let { address, name, info } = this.props;
        let balance = await getBalance(address);
        await this.setState({
            balance: balance,
            popupOpen: true,
            changeInfoDev: {
                ...this.state.changeInfoDev,
                params: {
                    ...this.state.changeInfoDev.params,
                    name: name,
                    info: info
                }
            }
        });
    };
    closeModal = async () => {
        await this.setState({
            popupOpen: false
        });
    };

    handleChangeTxParams = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({
            changeInfoDev: {
                ...this.state.changeInfoDev,
                [name]: e.target.value
            }
        });
    };

    handleChangeDataParams = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({
            changeInfoDev: {
                ...this.state.changeInfoDev,
                params: {
                    ...this.state.changeInfoDev.params,
                    [name]: e.target.value
                }
            }
        });
    };

    getDeveloper = async () => {
        let { address } = this.props;
        let state = await contractMethod({
            contract: 'PlayMarket',
            name: 'getStateDev',
            params: [address]
        });
        let name = await contractMethod({
            contract: 'PlayMarket',
            name: 'getNameDev',
            params: [address]
        });
        let info = await contractMethod({
            contract: 'PlayMarket',
            name: 'getInfoDev',
            params: [address]
        });
        return {
            state: state,
            name: web3Utils.hexToAscii(name).replace(/\u0000/g, ''),
            info: web3Utils.hexToAscii(info).replace(/\u0000/g, '')
        };
    };

    handleSubmitChangeInfo_1 = async e => {
        e.preventDefault();
        let { address } = this.props;
        let { name, info } = this.state.changeInfoDev.params;

        this.props.startLoading();
        try {
            let data = await getData({
                contract: 'PlayMarket',
                method: 'changeNameDev',
                params: [web3Utils.toHex(name), web3Utils.toHex(info)]
            });
            let gasLimit = await getGasLimit({
                from: address,
                contract: 'PlayMarket',
                data: data,
                reserve: 0
            });
            await this.setState({
                changeInfoDev: {
                    ...this.state.changeInfoDev,
                    step: 2,
                    data: data,
                    gasLimit: gasLimit
                }
            });
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };
    handleSubmitChangeInfo_2 = async e => {
        e.preventDefault();
        await this.setState({
            changeInfoDev: {
                ...this.state.changeInfoDev,
                step: 3
            }
        });
    };
    handleSubmitChangeInfo_3 = async e => {
        e.preventDefault();
        this.props.startLoading();
        let { keystore, gasPrice, address } = this.props;
        let { password, data, gasLimit } = this.state.changeInfoDev;
        try {
            let wallet = await getWallet(keystore, password);
            let signedTransaction = await getSignedTransaction({
                wallet: wallet,
                contract: 'PlayMarket',
                data: data,
                gasLimit: gasLimit,
                gasPrice: gasPrice
            });
            let tx = await sendSignedTransaction(signedTransaction.rawTransaction);
            let transactionStatus = await getTransactionStatus(tx.transactionHash);
            let balance = await getBalance(address);
            await this.setState({
                balance: balance,
                changeInfoDev: {
                    ...this.state.changeInfoDev,
                    hash: tx.transactionHash
                }
            });
            if (transactionStatus) {
                let developer = await this.getDeveloper();
                this.props.userChangeInfo({
                    name: developer.name,
                    info: developer.info
                });
                await this.setState({
                    changeInfoDev: {
                        ...this.state.changeInfoDev,
                        step: 4
                    }
                });

            } else {
                Notification('error', 'Transaction failed');
            }
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
            console.log(err);
        }
    };
    handleSubmitChangeInfo_4 = async e => {
        e.preventDefault();
        await this.setState({
            popupOpen: false,
            changeInfoDev: {
                ...this.state.changeInfoDev,
                step: 1
            }
        });
    };

    handleClickBackChangeInfo_1 = async () => {
        await this.setState({
            changeInfoDev: {
                ...this.state.changeInfoDev,
                step: 1
            }
        });
    };
    handleClickBackChangeInfo_2 = async () => {
        await this.setState({
            changeInfoDev: {
                ...this.state.changeInfoDev,
                step: 2
            }
        });
    };

    render(){
        let { address, name, gasPrice } = this.props;
        let { popupOpen, balance, changeInfoDev } = this.state;
        let { gasLimit, password } = this.state.changeInfoDev;

        return (
          <header className="header">
            <div className="header__container">
              <div className="header__container--left">
                <div className="header__address">{address}</div>
              </div>
              <div className="header__container--right">
                <div className="header__name">
                    <div className="header__name__text">{name}</div>
                    <div className="header__name__edit" onClick={this.openModal}></div>
                </div>
                <button className="header__logout" onClick={this.handleClickLogout}>Logout</button>
              </div>
            </div>
              <Popup className="header-popup" open={popupOpen} onClose={this.closeModal}>
                  <div>
                      {
                          popupOpen ? (
                              <div>
                                  <div className="header-popup__main">
                                      <h3 className="header-popup__main__title">Account info</h3>
                                      <ul className="header-popup__main__list">
                                          <li className="header-popup__main__list-item">
                                              <div className="header-popup__main__list-item__title">Address:</div>
                                              <div className="header-popup__main__list-item__value">{address}</div>
                                          </li>
                                          <li className="header-popup__main__list-item">
                                              <div className="header-popup__main__list-item__title">Balance:</div>
                                              <div className="header-popup__main__list-item__value">{web3Utils.fromWei(balance, 'ether')} <span>ETH</span></div>
                                          </li>
                                      </ul>
                                  </div>
                                  <div>
                                  <div className="header-popup__action">
                                      <div className="header-popup__action__title">Change info</div>
                                          {
                                              changeInfoDev.step === 1 ? (
                                                  <form className="header-popup__changeInfo" onSubmit={this.handleSubmitChangeInfo_1}>
                                                      <div className="header-popup__changeInfo__title">Please, fill in a form to continue.</div>
                                                      <ul className="header-popup__changeInfo__list">
                                                          <li className="header-popup__changeInfo__list-item">
                                                              <div className="header-popup__changeInfo__list-item__title">Name:</div>
                                                              <input className="header-popup__changeInfo__list-item__input" required name="name" type="text" value={changeInfoDev.params.name} onChange={this.handleChangeDataParams}/>
                                                          </li>
                                                          <li className="header-popup__changeInfo__list-item">
                                                              <div className="header-popup__changeInfo__list-item__title">Info:</div>
                                                              <input className="header-popup__changeInfo__list-item__input" name="info" type="text" value={changeInfoDev.params.info} onChange={this.handleChangeDataParams}/>
                                                          </li>
                                                      </ul>
                                                      <div className="header-popup__btn-block">
                                                          <button className="header-popup__btn-block__btn">continue</button>
                                                          <div className="header-popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                      </div>
                                                  </form>
                                              ) : null
                                          }
                                          {
                                              changeInfoDev.step === 2 ? (
                                                  <form className="header-popup__changeInfo" onSubmit={this.handleSubmitChangeInfo_2}>
                                                      <div className="header-popup__changeInfo__title">Confirmation of the transaction data</div>
                                                      <ul className="header-popup__changeInfo__preview-list">
                                                          <li className="header-popup__changeInfo__preview-list__item">
                                                              <div className="header-popup__changeInfo__preview-list__item--title">Name:</div>
                                                              <div className="header-popup__changeInfo__preview-list__item--value">{changeInfoDev.params.name}</div>
                                                          </li>
                                                          <li className="header-popup__changeInfo__preview-list__item">
                                                              <div className="header-popup__changeInfo__preview-list__item--title">Info:</div>
                                                              <div className="header-popup__changeInfo__preview-list__item--value">
                                                                  {
                                                                      !!changeInfoDev.params.info ? changeInfoDev.params.info : (
                                                                          <span className="header-popup__changeInfo__preview-list__item--value__placeholder">Not specified</span>
                                                                      )
                                                                  }
                                                              </div>
                                                          </li>
                                                      </ul>
                                                      <ul className="header-popup__changeInfo__list">
                                                          <li className="header-popup__changeInfo__list-item">
                                                              <div className="header-popup__changeInfo__list-item__title">Gas Limit:</div>
                                                              <input className="header-popup__changeInfo__list-item__input" required name="gasLimit" type="number" value={gasLimit} onChange={this.handleChangeTxParams}/>
                                                          </li>
                                                      </ul>
                                                      <ul className="header-popup__changeInfo__fee-list">
                                                          <li className="header-popup__changeInfo__fee-list__item">
                                                              <div className="header-popup__changeInfo__fee-list__item--title">Gas Price:</div>
                                                              <div className="header-popup__changeInfo__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')} Gwei</div>
                                                          </li>
                                                          <li className="header-popup__changeInfo__fee-list__item">
                                                              <div className="header-popup__changeInfo__fee-list__item--title">Approximate fee:</div>
                                                              <div className="header-popup__changeInfo__fee-list__item--value">{web3Utils.fromWei((gasPrice * gasLimit).toString(), 'ether')}</div>
                                                          </li>
                                                      </ul>
                                                      <div className="header-popup__btn-block">
                                                          <button className="header-popup__btn-block__btn">Accept</button>
                                                          <div className="header-popup__btn-block__btn--cancel" onClick={this.handleClickBackChangeInfo_1}>Back</div>
                                                      </div>
                                                  </form>
                                              ) : null
                                          }
                                          {
                                              changeInfoDev.step === 3 ? (
                                                  <form className="header-popup__changeInfo" onSubmit={this.handleSubmitChangeInfo_3}>
                                                      <div className="header-popup__changeInfo__title">Sending transaction</div>
                                                      <ul className="header-popup__changeInfo__list">
                                                          <li className="header-popup__changeInfo__list-item">
                                                              <div className="header-popup__changeInfo__list-item__title">Keystore password:</div>
                                                              <input className="header-popup__changeInfo__list-item__input" required name="password" type="password" value={password} onChange={this.handleChangeTxParams}/>
                                                          </li>
                                                      </ul>
                                                      <div className="header-popup__btn-block">
                                                          <button className="header-popup__btn-block__btn">send tx</button>
                                                          <div className="header-popup__btn-block__btn--cancel" onClick={this.handleClickBackChangeInfo_2}>Back</div>
                                                      </div>
                                                  </form>
                                              ) : null
                                          }
                                          {
                                              changeInfoDev.step === 4 ? (
                                                  <form className="header-popup__changeInfo" onSubmit={this.handleSubmitChangeInfo_4}>
                                                      <h3 className="header-popup__changeInfo__title">Your information was successfully changed!</h3>
                                                      <div className="header-popup__btn-block header-popup__btn-block--center">
                                                          <button className="header-popup__btn-block__btn">OK</button>
                                                      </div>
                                                  </form>
                                              ) : null
                                          }
                                        </div>
                                  </div>
                              </div>
                          ) : null
                      }
                  </div>
              </Popup>
          </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gasPrice: state.gasPrice,
        keystore: state.user.keystore,
        address: state.user.address,
        name: state.user.name,
        info: state.user.info
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        userLogout: () => dispatch(userLogout()),
        userChangeInfo: (payload) => dispatch(userChangeInfo(payload)),
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
