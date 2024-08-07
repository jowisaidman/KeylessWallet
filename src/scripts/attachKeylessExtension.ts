"use strict";

import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail } from "web3/lib/commonjs/web3_eip6963";


declare global{
    interface WindowEventMap {
      "eip6963:announceProvider": EIP6963AnnounceProviderEvent
    }
  }