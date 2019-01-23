pragma solidity 0.4.24;

interface OracleInterface {
  function fulfillData(
    uint256 requestId,
    uint256 _payment,
    address _callbackAddress,
    bytes4 _callbackFunctionId,
    uint256 _expiration,
    bytes32 data
  ) external returns (bool);
  function getAuthorizationStatus(address node) external view returns (bool);
  function setFulfillmentPermission(address node, bool allowed) external;
  function withdraw(address recipient, uint256 amount) external;
  function withdrawable() external view returns (uint256);
}
