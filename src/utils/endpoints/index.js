export const BASEURL = "https://prod.apiv1.battleroof.com/backend/v1/";
// // export const BASEURL = "https://api.battleroof.com/backend/v1/";
// export const BASEURL = "https://api.battleroof.app/backend/v1/";
export const BASEURL2 = "https://prod.apiv1.battleroof.com/backend/v2/";
export const BASEURL3 = "https://prod.apiv1.battleroof.com/backend/league/";
export const IMAGE_BASEURL = "https://prod.apiv1.battleroof.com/";

// Authorization
export const login_url = BASEURL + "signin";
export const update_profile = BASEURL + "update-profile";
export const update_password = BASEURL + "update-password";

// Tournaments
export const add_Tournament = BASEURL + "tournament-store";
export const delete_Tournament = BASEURL + "tournament-delete";
export const update_Tournament = BASEURL + "tournament-update";
export const getTournament_list = BASEURL + "tournament-list";
export const tour_status = BASEURL + "tournament-status";
export const tour_view = BASEURL + "tournament-view";
export const declare_slots = BASEURL + "declare-slots";
export const tour_running_status = BASEURL + "tournament-running-status";
export const tournament_csv_export = BASEURL + "tournaments/export-csv";

// Games
export const game_list = BASEURL + "game-list";
export const add_game = BASEURL + "game-store";
export const add_placement = BASEURL + "game-update-pp";
export const get_placement = BASEURL + "game-get-pp";
export const update_game = BASEURL + "game-update";
export const delete_game = BASEURL + "game-delete";
export const game_status = BASEURL + "game-status";
export const game_view = BASEURL + "game-view";
export const game_played_list = BASEURL + "get-player-list";
export const game_export = BASEURL + "games/export-csv";

// Games Types
export const add_game_type = BASEURL + "game-type-store";
export const game__type_list = BASEURL + "game-type-list";
export const delete_game_type = BASEURL + "game-type-delete";
export const update_game_type = BASEURL + "game-type-update";
export const game_status_type = BASEURL + "game-type-status";

// User
export const user_list = BASEURL + "user-list";
export const user_view = BASEURL + "user-view";
export const update_user = BASEURL + "user-update";
export const export_user_csv = BASEURL + "users/export-csv";

export const delete_user = BASEURL + "user-delete";
export const user_status = BASEURL + "user-status";
export const update_user_wallet = BASEURL + "update-user-wallet";

// Transction Logs
export const transaction_logs = BASEURL + "transaction-all-list";
export const withdraw_requests = BASEURL + "withdraw-request-list";
export const approve_requests = BASEURL + "approve-request";
export const transaction_csv_export = BASEURL + "transactions/export-csv";

// Teams
export const team_list = BASEURL + "team-list";
export const team_view = BASEURL + "team-view";
export const team_delete = BASEURL + "team-delete";
export const team_player_delete = BASEURL + "player-delete";
export const all_team_list = BASEURL + "all-teams";
export const delete_joined_tournament = BASEURL + "delete-joined-tournament";
export const teams_csv_export = BASEURL + "teams/export-csv";

// Players
export const player_list = BASEURL + "player-list";
export const player_view = BASEURL + "player-view";

// Notification
export const notification_list = BASEURL + "notification-list";
export const add_notification = BASEURL + "notification-store";
export const delete_notification = BASEURL + "notification-delete";
export const notification_status = BASEURL + "notification-status";
export const notification_csv_export = BASEURL + "notifications/export-csv";

// Settings
export const view_setting = BASEURL + "setting-view";
export const update_setting = BASEURL + "setting-update";

// TDM Players
export const tdp_player_view = BASEURL + "player-view";
export const game_player_list = BASEURL + "geme-played-by-user";
export const game_played_by_user = BASEURL + "game-played-by-user";
export const tdm_player_view = BASEURL + "view-player";

// Create Room Id
export const create_room_id = BASEURL + "update-room-details";

// Bulk Ranks Update
export const update_rank = BASEURL + "update-rank";
export const bulk_update_rank = BASEURL + "bulk-update-rank";

export const settlement_status = BASEURL + "settlement-status";

// Sponsor List
export const sponsor_list = BASEURL + "sponsor-list";
export const add_sponsor = BASEURL + "sponsor-store";
export const update_sponsor = BASEURL + "sponsor-update";
export const delete_sponsor = BASEURL + "sponsor-delete";
export const sponsor_status = BASEURL + "sponsor-status";

// dashboard record
export const record_count = BASEURL + "get-count";
export const registration_count = BASEURL + "get-user-registration-count";
export const device_count = BASEURL + "get-device-count";

export const total_amount = BASEURL + "get-total-amount";
export const transaction_list = BASEURL + "get-transaction-list";
export const transaction_list_by_id = BASEURL + "transaction-list";

export const add_support = BASEURL + "support-update";
export const view_support = BASEURL + "support-view";

// update streaming link
export const update_streaming_link = BASEURL + "update-streaming-link";

// ---------- league section
// 1.
export const create_stage = BASEURL2 + "stage-store";
export const update_stages = BASEURL2 + "stage-update";
export const delete_stages = BASEURL2 + "stage-delete";
export const update_stage_status = BASEURL2 + "stage-status";
export const get_stages_list = BASEURL2 + "stage-list";
export const get_stage_round_list = BASEURL2 + "league-tournaments";
export const league_stage_csv_export = BASEURL2 + "stages/export-csv";
export const league_csv_export = BASEURL2 + "league-tournaments/export-csv";
// 2.
export const league_tour_list = BASEURL2 + "tournament-list";
export const league_tour_view = BASEURL2 + "tournament-view";
export const league_tour_create = BASEURL2 + "tournament-store";
export const league_tour_delete = BASEURL2 + "tournament-delete";
export const league_tour_update = BASEURL2 + "tournament-update";
export const league_tour_status = BASEURL2 + "tournament-status";
export const league_tour_stage = BASEURL2 + "get-tournament-stages";
export const league_tour_teams =
  BASEURL2 + "league-tournaments/get-joined-teams";
export const delete_league_tour_stage = BASEURL2 + "delete-tournament-stage";
export const update_league_tour_stage = BASEURL2 + "league-tournaments";
export const league_tour_running_status =
  BASEURL2 + "tournament-running-status";

// export const create_round_group = BASEURL + "league-tournaments/stages/rounds";
export const create_round_group = BASEURL2 + "league-tournaments/stages/rounds";
export const update_round_group = BASEURL2 + "league-tournaments/update-lobby";
