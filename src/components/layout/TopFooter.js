import React from "react";
import moment from "moment";
const TopFooter = (props) => {
  return (
    <div>
      <footer class="main-footer">
        
          Copyright &copy; 2022-{moment().format('YYYY')} <a href="#">iPoultry</a>. All rights reserved.
      </footer>
    </div>
  );
};
export default TopFooter;
