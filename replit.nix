{ pkgs }: {
	deps = [
		pkgs.libarchive
  pkgs.wget
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
	];
}